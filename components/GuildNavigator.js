import React from 'react';
import Link from 'next/link';

import { Avatar, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';

export default function GuildNavigator(props) {
    const router = useRouter();

    /** @type {Guild} */ const guild = props.guild;

    /** @type {[ Boolean, Function ]} */ const [ openCollapse, setOpenCollapse ] = React.useState(router.query.guild == guild.id);
    const handleClick = (event) =>{
        event.preventDefault();
        setOpenCollapse(!openCollapse);
    };

    return (
        <>
            <Link key={guild.id} href={guild.hasBot ? `/guilds/${guild.id}` : `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot`}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <Avatar src={guild.iconURL}>{guild.name.slice(0, 1)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={guild.hasBot ? guild.name : null} secondary={guild.hasBot ? null : guild.name} />
                        {guild.hasBot ? openCollapse ? <ExpandLessIcon onClick={handleClick} /> : <ExpandMoreIcon onClick={handleClick} /> : ''}
                    </ListItemButton>
                </ListItem>
            </Link>

            <Collapse in={openCollapse} timeout='auto' unmountOnExit>
                <List disablePadding sx={{ pl: 4 }}>
                    <ListItem onClick={() => router.push(`/guilds/${guild.id}`, undefined, { shallow: true })}disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <InfoIcon></InfoIcon>
                            </ListItemIcon>
                            <ListItemText primary='Overview' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={() => router.push(`/guilds/${guild.id}?tab=1`, undefined, { shallow: true })}disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <GppMaybeIcon></GppMaybeIcon>
                            </ListItemIcon>
                            <ListItemText primary='Infractions' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem onClick={() => router.push(`/guilds/${guild.id}?tab=2`, undefined, { shallow: true })}disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <ChatIcon></ChatIcon>
                            </ListItemIcon>
                            <ListItemText primary='Tickets' />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Collapse>
        </>
    );
}