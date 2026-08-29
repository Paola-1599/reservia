import React from "react";
import styles from "../styles/LugarSeguro.module.css";

const videos = [
    {
        title: "Meditación'Mi Lugar Seguro'",
        url: "https://www.youtube.com/embed/WC6wiAlXwkk",
    },
    {
        title: "Relajación Progresiva de Jacobson",
        url: "https://www.youtube.com/embed/vAaRM_wV5W8",
    },
    {
        title: "Respiración cuatro tiempos",
        url: "https://www.youtube.com/embed/Nvtr6Ms4bmo",
    },
    {
        title: "Respiración en triángulo",
        url: "https://www.youtube.com/embed/qQjZDgZC9-M",
    },
    {
        title: "Método 5-4-3-2-1",
        url: "https://www.youtube.com/embed/37FzHqlcxUI",
    },
];
const VideoList = () => {
    return (
        <div className={styles.videoListContainer}>
            {videos.map((video, index) => (
                <div key={index} className={styles.videoCard}>
                    <h4>{video.title}</h4>
                    <iframe
                        src={video.url}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title={video.title}
                    ></iframe>
                </div>
            ))}
        </div>
    );
};

export default VideoList;   
