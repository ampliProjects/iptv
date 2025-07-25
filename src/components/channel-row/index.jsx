import React from 'react';
function ChannelRow({ title, channels, onSelect, videoRef, setPreviewChannel, previewTimeoutRef }) {
    return (
        <div className="channel-row">
          
            <div className="channels-grid">
                {channels.map((ch,i) => (
                    <div
                        style={{margin:2}}
                        key={ch.url+i}
                        className="channel-card"
                        onClick={() => {
                            onSelect(ch.url)
                            setTimeout(() => {
                                videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100)
                        }}
                        onMouseEnter={() => {
                            previewTimeoutRef.current = setTimeout(() => {
                                setPreviewChannel(ch);
                            }, 500); 
                        }}
                        onMouseLeave={() => {
                            clearTimeout(previewTimeoutRef.current);
                            setPreviewChannel(null);
                        }}
                    >
                        
                        <span>{ch.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ChannelRow;
