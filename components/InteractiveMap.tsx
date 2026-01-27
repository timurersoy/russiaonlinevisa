'use client';

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useTranslations } from 'next-intl';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// List of eligible countries as per the instructions page
const eligibleCountries = [
    "Austria", "Barbados", "Bahrain", "Belgium", "Bulgaria", "Bhutan", "Cambodia",
    "China", "Taiwan", "Croatia", "Cyprus", "Czechia", "Czech Republic", "Denmark",
    "Eswatini", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Ireland", "Italy", "Japan", "Jordan",
    "Kenya", "North Korea", "Dem. Rep. Korea", "Kuwait", "Latvia",
    "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Malta", "Mexico",
    "Monaco", "Myanmar", "Netherlands", "North Macedonia", "Norway", "Oman",
    "Papua New Guinea", "Philippines", "Poland", "Portugal", "Romania", "Saint Lucia",
    "San Marino", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "Spain",
    "Sweden", "Switzerland", "Tonga", "Trinidad and Tobago", "Turkmenistan",
    "Türkiye", "Vatican", "Vietnam", "Zimbabwe"
];

export default function InteractiveMap() {
    const t = useTranslations('InteractiveMap');
    const [content, setContent] = useState("");
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const isEligible = (geoName: string) => {
        if (!geoName) return false;
        return eligibleCountries.some(c =>
            geoName.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(geoName.toLowerCase())
        );
    };

    const [mounted, setMounted] = useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[500px] bg-blue-50/30 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400">Loading map...</div>;

    return (
        <div className="w-full h-[500px] bg-blue-50/30 rounded-xl overflow-hidden relative border border-gray-100">
            {content && (
                <div
                    className="absolute z-50 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-[#0039A6] text-sm font-semibold text-[#0039A6] pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px]"
                    style={{ left: position.x, top: position.y }}
                >
                    {content}
                </div>
            )}

            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
                <ZoomableGroup center={[20, 0]} zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo) => {
                                let name = geo.properties.name;
                                // Handle name override for Turkey
                                if (name === "Turkey") {
                                    name = "Türkiye";
                                }

                                const isRussia = name === "Russia" || name === "Russian Federation";
                                const eligible = isEligible(name);

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onMouseEnter={() => {
                                            if (isRussia) {
                                                setContent(t('tooltipHost', { name }));
                                            } else if (eligible) {
                                                setContent(t('tooltipEligible', { name }));
                                            } else {
                                                setContent(name);
                                            }
                                        }}
                                        onMouseMove={(event: any) => {
                                            const bounds = event.currentTarget.closest('div.w-full')?.getBoundingClientRect();
                                            if (bounds) {
                                                setPosition({
                                                    x: event.clientX - bounds.left,
                                                    y: event.clientY - bounds.top
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            setContent("");
                                        }}
                                        style={{
                                            default: {
                                                fill: isRussia ? "#D52B1E" : (eligible ? "#0039A6" : "#D6D6DA"),
                                                outline: "none",
                                                stroke: "#FFFFFF",
                                                strokeWidth: 0.5
                                            },
                                            hover: {
                                                fill: isRussia ? "#D52B1E" : (eligible ? "#B01F15" : "#F53"),
                                                outline: "none",
                                                cursor: (eligible || isRussia) ? "pointer" : "default"
                                            },
                                            pressed: {
                                                fill: "#E42",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow-sm text-xs text-gray-500">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-[#D52B1E] rounded-sm"></div>
                    <span>{t('hostRussia')}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-[#0039A6] rounded-sm"></div>
                    <span>{t('eligibleCountries')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#D6D6DA] rounded-sm"></div>
                    <span>{t('other')}</span>
                </div>
            </div>
        </div>
    );
}
