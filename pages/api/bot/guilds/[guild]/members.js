import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session && req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) return res.status(403).send();

    /** @type {Array<GuildMember>} */ const cached = cacheData.get(`/api/bot/guilds/${req.query.guild}/members`);
    if(cached) return await verifyPermissions(req, res, session, cached);

    await fetch(`${process.env.DISCORD_CLIENT_API}/api/guilds/${req.query.guild}/members`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } })
        .then(async response => {
            if(!response.ok) return res.status(response.status).send();

            /** @type {Array<GuildMember>} */ const json = await response.json();
            cacheData.put(`/api/bot/guilds/${req.query.guild}/members`, json, 60 * 1000);

            await verifyPermissions(req, res, session, json);
        }).catch(() => res.status(500).send());
}

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @param {import('next-auth/providers/discord').DiscordProfile} session
 * @param {Array<GuildMember>} members
 */
async function verifyPermissions(req, res, session, members){
    if(session){
        const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${req.query.guild}/`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } });
        if(!guild.ok) return res.status(401).send();
    }

    res.status(200).json(members);
}