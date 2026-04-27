"use client";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("./property-map"), { ssr: false });

export default PropertyMap;
