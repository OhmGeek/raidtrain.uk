import React, { useEffect, useState } from 'react';

export default function TwitchPlayer({ channel }) {
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && channel) {
      // 1. Extract clean domain names (strips out port numbers automatically)
      const hostName = window.location.hostname;
      const cleanChannel = channel.toLowerCase().trim();

      // 2. Build parameters securely using the browser query utility
      const params = new URLSearchParams();
      params.append('channel', cleanChannel);
      params.append('parent', hostName);
      params.append('autoplay', 'true');

      // 3. FORCE player.twitch.tv (DO NOT USE www.twitch.tv)
      setEmbedUrl('https://player.twitch.tv/?' + params.toString());
    }
  }, [channel]);

  if (!channel || !embedUrl) {
    return (
      <div className="twitch-responsive-container flex-center">
        <span className="fallback-text">[ WAITING FOR TRAIN DEPARTURE ]</span>
      </div>
    );
  }

  return (
    <div className="twitch-responsive-container">
      <iframe
        src={embedUrl}
        className="twitch-absolute-frame"
        allowFullScreen={true}
        scrolling="yes"
        allow="autoplay; encrypted-media; picture-in-picture"
        title="Twitch Live Stream Embed"
      ></iframe>
    </div>
  );
}
