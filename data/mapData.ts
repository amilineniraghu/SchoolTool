export interface MapLocation {
    id: string; // Corresponds to the feature id in GeoJSON
    name: string;
}

export const worldLocations: MapLocation[] = [
    { id: "Brazil", name: "Brazil" },
    { id: "Australia", name: "Australia" },
    { id: "Canada", name: "Canada" },
    { id: "China", name: "China" },
    { id: "Egypt", name: "Egypt" },
    { id: "Germany", name: "Germany" },
    { id: "India", name: "India" },
    { id: "Japan", name: "Japan" },
    { id: "Russia", name: "Russia" },
    { id: "South Africa", name: "South Africa" },
];

export const indiaLocations: MapLocation[] = [
    { id: "IN-DL", name: "Delhi" },
    { id: "IN-GJ", name: "Gujarat" },
    { id: "IN-KA", name: "Karnataka" },
    { id: "IN-KL", name: "Kerala" },
    { id: "IN-MH", name: "Maharashtra" },
    { id: "IN-RJ", name: "Rajasthan" },
    { id: "IN-TN", name: "Tamil Nadu" },
    { id: "IN-UP", name: "Uttar Pradesh" },
    { id: "IN-WB", name: "West Bengal" },
];
