import React, { useEffect, useState } from 'react';


function TwitchPlayer(channel) {
    const [parentDomain, setParentDomain] = useState('');
    useEffect(() => {
        // Only runs on the client-side to safely get the current domain
        if (typeof window !== 'undefined') {
            // Strips ports (like :3000) so it works perfectly for both localhost and production
            setParentDomain(window.location.hostname);
        }
    }, []);

    // Prevent rendering the iframe until the parent domain is resolved
    if (!parentDomain) return null;
    return (
        <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=${parentDomain}&autoplay=true`}
            height="480"
            width="720"
            allowFullScreen={true}
            frameBorder="0"
            scrolling="no"
            // Required so that the iframe can include tracking permissions.
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        ></iframe>
    )
};

export default TwitchPlayer;