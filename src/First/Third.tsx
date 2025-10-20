import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

// Fonction pour récupérer les paramètres de l'URL
export function getUrlParams(url: string = window.location.href): URLSearchParams {
    const urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

// Typage du composant fonctionnel
const Livestream: React.FC = () => {
    // Récupérer le nom du parent depuis le localStorage (avec valeur par défaut)
    const storedNom = localStorage.getItem("nomparent") || "defaultRoom";
    const roomID = "radhib";

    // Fonction pour gérer la réunion
    const myMeeting = async (element: HTMLDivElement | null) => {
        if (element) {
            // générer le Kit Token
            const appID = ;
            const serverSecret = "";
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, Date.now().toString(), storedNom);

            // Créer l'instance à partir du Kit Token
            const zp = ZegoUIKitPrebuilt.create(kitToken);

            // Démarrer l'appel vidéo
            zp.joinRoom({
                container: element,
                sharedLinks: [
                    {
                        name: 'Personal link',
                        url:
                            window.location.protocol + '//' +
                            window.location.host + window.location.pathname +
                            '?roomID=' +
                            roomID,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // Mode de discussion 1-à-1
                },
            });
        }
    };

    return (
        <div
            className="myCallContainer"
            ref={(element: HTMLDivElement | null) => {
                if (element) {
                    myMeeting(element);
                }
            }} // Passer l'élément à la fonction
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}

export default Livestream;
