export default function TwitchPlayer({ channel }) {
  let embedUrl = '';
  if (typeof window !== 'undefined' && channel) {
    const hostName = window.location.hostname;
    const cleanChannel = channel.toLowerCase().trim();

    const params = new URLSearchParams();
    params.append('channel', cleanChannel);
    params.append('parent', hostName);
    params.append('autoplay', 'true');

    embedUrl = 'https://player.twitch.tv/?' + params.toString();
  }

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
