"use client";

import React, { FC } from "react";
import { useAppSelector } from "@/Redux/Hooks";
import ArrowMesh from "./ArrowMesh";

type ArrowLayerProps = {
};

const ArrowLayer: FC<ArrowLayerProps> = ({  }) => {
    const { arrows, previewArrow } = useAppSelector((s) => s.Arrow);

    return (
        <group>
            {arrows.map((arrow, idx) => (
                <ArrowMesh
                    key={`${arrow.from}-${arrow.to}-${idx}`}
                    from={arrow.from}
                    to={arrow.to}
                />
            ))}
            {previewArrow && (
                <ArrowMesh
                    key="preview"
                    from={previewArrow.from}
                    to={previewArrow.to}
                />
            )}
        </group>
    );
};

export default ArrowLayer;
