
import useArrowDragHook from "@/hooks/useArrowDragHook";
import { useAppSelector } from "@/Redux/Hooks";

const PlaneForArrows = () => {
    const {
        boardSize,
    } = useAppSelector(
        (s) => s.Chess
    );

    const bind = useArrowDragHook();

    const position: [
        number,
        number,
        number
    ] = [0, 0, -20];

    return (
        <mesh
            {...bind()}
            position={position}
        >
            <boxGeometry
                args={[
                    boardSize,
                    boardSize,
                    1,
                ]}
            />

            <meshBasicMaterial
                transparent
                opacity={0}
            />
        </mesh>
    );
};

export default PlaneForArrows;