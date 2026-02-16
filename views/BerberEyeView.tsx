import React, { useState, useRef, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader.tsx';
import { LANDMARKS } from '../constants.tsx';
import { Landmark } from '../types.ts';
import Loader from '../components/LoadingSpinner.tsx';

// --- Helper function to calculate distance between two lat/lng points ---
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
};

const findNearbyLandmark = (lat: number, lng: number): Landmark | null => {
    const SCAN_RADIUS_METERS = 200; // Scan within a 200m radius
    for (const landmark of LANDMARKS) {
        const distance = getDistanceInMeters(lat, lng, landmark.coords.lat, landmark.coords.lng);
        if (distance < SCAN_RADIUS_METERS) {
            return landmark;
        }
    }
    return null;
};

// --- AR Components ---
const Hotspot: React.FC<{ top: string; left: string; onClick: () => void; delay: string }> = ({ top, left, onClick, delay }) => {
    return (
        <button
            onClick={onClick}
            className="absolute w-8 h-8 rounded-full bg-primary-ocean-blue/80 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ring-4 ring-primary-ocean-blue/50 opacity-0 animate-pop-in z-10"
            style={{ top, left, animationDelay: delay }}
            aria-label="Information hotspot"
        >
             <style>{`
                @keyframes pop-in {
                    0% { transform: scale(0) translate(-50%, -50%); opacity: 0; }
                    100% { transform: scale(1) translate(-50%, -50%); opacity: 1; }
                }
                .animate-pop-in { animation: pop-in 0.3s forwards; }
            `}</style>
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-white"></span>
            </span>
        </button>
    );
};

const InfoCard: React.FC<{title: string, content: string, delay: string}> = ({title, content, delay}) => (
    <div className="bg-neutral-slate-dark/60 backdrop-blur-md p-4 rounded-lg border border-neutral-slate-gray/20 opacity-0 animate-slide-in" style={{ animationDelay: delay }}>
        <style>{`
            @keyframes slide-in {
                0% { transform: translateX(-20px); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in { animation: slide-in 0.4s forwards; }
        `}</style>
        <h4 className="font-bold text-primary-ocean-blue text-sm">{title}</h4>
        <p className="text-xs text-neutral-sand-beige/90">{content}</p>
    </div>
);

const BerberEyeView: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const [detectedLandmark, setDetectedLandmark] = useState<Landmark | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                setStream(mediaStream);
            } catch (err) {
                setError("Camera access is required for Berber Eye. Please enable it in your browser settings.");
                console.error("Camera access denied:", err);
            }
        };
        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }
    }, [stream]);

    const handleScan = () => {
        setIsScanning(true);
        setScanComplete(false);
        setDetectedLandmark(null);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const landmark = findNearbyLandmark(latitude, longitude);

                setTimeout(() => {
                    if (landmark) {
                        setDetectedLandmark(landmark);
                    } else {
                        setError("No recognized landmark in your immediate vicinity.");
                    }
                    setScanComplete(true);
                    setIsScanning(false);
                }, 1500); // Simulate analysis time
            },
            (geoError) => {
                console.error("Geolocation error:", geoError);
                setError("Could not get your location. Please enable location services.");
                setIsScanning(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleReset = () => {
        setScanComplete(false);
        setDetectedLandmark(null);
        setError(null);
    };

    return (
        <section id="berber-eye" className="py-16 sm:py-24 animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <SectionHeader title="Berber Eye AR" />
                 <p className="-mt-8 mb-8 text-center text-neutral-slate-gray max-w-2xl mx-auto">
                    Point your camera at any landmark to unlock a world of information, powered by AI.
                </p>

                <div className="max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden border-4 border-neutral-slate-gray/40 relative bg-neutral-slate-dark shadow-2xl shadow-primary-terra-cotta/10">
                    <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

                    {isScanning && <div className="absolute inset-0 bg-neutral-slate-dark/50 flex items-center justify-center z-20"><Loader message="Analyzing surroundings..." /></div>}

                    {scanComplete && detectedLandmark && (
                        <div className="absolute inset-0 z-20 p-4 flex flex-col justify-between">
                            <div className="w-full max-w-xs space-y-2">
                                {detectedLandmark.infoCards.map((card, i) => (
                                    <InfoCard key={i} title={card.title} content={card.content} delay={`${0.2 + i * 0.2}s`} />
                                ))}
                            </div>
                            <div>
                                <button onClick={handleReset} className="bg-neutral-slate-dark/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm hover:bg-neutral-slate-dark">Scan Again</button>
                            </div>
                            {detectedLandmark.hotspots.map((hotspot, i) => (
                                <Hotspot key={i} top={hotspot.top} left={hotspot.left} onClick={() => alert(hotspot.content)} delay={`${1 + i * 0.2}s`} />
                            ))}
                        </div>
                    )}

                    {!stream && !error && <div className="absolute inset-0 bg-neutral-slate-dark flex items-center justify-center z-20"><Loader message="Starting camera..." /></div>}

                    {error && (
                         <div className="absolute inset-0 bg-neutral-slate-dark/80 flex flex-col items-center justify-center z-20 p-4 text-center">
                            <p className="text-semantic-error">{error}</p>
                             {scanComplete && <button onClick={handleReset} className="mt-4 bg-primary-terra-cotta text-neutral-white px-4 py-2 rounded-full text-sm font-semibold">Try Again</button>}
                        </div>
                    )}

                    {!isScanning && !scanComplete && stream && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <button onClick={handleScan} className="bg-primary-terra-cotta/80 backdrop-blur-sm text-neutral-white font-bold h-20 w-20 rounded-full border-4 border-white/50 flex items-center justify-center transform hover:scale-110 transition-transform relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-terra-cotta opacity-75"></span>
                                SCAN
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BerberEyeView;
