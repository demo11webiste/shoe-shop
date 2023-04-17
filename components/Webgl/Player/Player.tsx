import { Capsule, PerspectiveCamera, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, quat, euler } from "@react-three/rapier";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { keyChecker } from "./keyChecker";
import { store } from "@/store";

type props = {
  camera: boolean;
};

const Player: React.FC<props> = ({ camera }) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<any>();
  useHelper(cameraRef, THREE.CameraHelper);

  const [isForward, setIsForward] = useState<boolean>(false);
  const [isBackward, setIsBackward] = useState<boolean>(false);
  const [isLeft, setIsLeft] = useState<boolean>(false);
  const [isRight, setIsRight] = useState<boolean>(false);
  const [isRightTop, setIsRightTop] = useState<boolean>(false);
  const [isRightBottom, setIsRightBottom] = useState<boolean>(false);
  const [isLeftTop, setIsLeftTop] = useState<boolean>(false);
  const [isLeftBottom, setIsLeftBottom] = useState<boolean>(false);
  const [turning, setTurning] = useState<number>(0);
  const [active, setActive] = useState<boolean>(true);

  console.log(turning);

  useEffect(() => {
    store.touchTurnLeft = () => {
      if (turning === 2) {
        setTurning(0);
      } else {
        setTurning(turning + 0.25);
      }
    };
    store.touchTurnRight = () => {
      if (turning === -2) {
        setTurning(0);
      } else {
        setTurning(turning - 0.25);
      }
    };
  }, [turning]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      keyChecker(
        event,
        setIsForward,
        setIsBackward,
        setIsLeft,
        setIsRight,
        setIsRightTop,
        setIsRightBottom,
        setIsLeftBottom,
        setIsLeftTop,
        setTurning,
        turning
      );
    };

    const keyUpHandler = () => {
      setIsForward(false);
      setIsBackward(false);
      setIsLeft(false);
      setIsRight(false);
      setIsRightTop(false);
      setIsRightBottom(false);
      setIsLeftBottom(false);
      setIsLeftTop(false);
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    // camera
    if (turning === 2 || turning === -2) {
      setActive(false);
      gsap
        .timeline()
        .to(cameraRef.current!.rotation, { y: Math.PI * turning })
        .call(() => setTurning(0))
        .set(cameraRef.current!.rotation, { y: 0 })
        .call(() => setActive(true));
    } else {
      if (active) {
        gsap
          .timeline()
          .to(cameraRef.current!.rotation, { y: Math.PI * turning });
      }
    }
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [isBackward, isForward, isLeft, isRight, turning]);

  useFrame(() => {
    if (rigidBody.current) {
      if (isForward) {
        rigidBody.current!.applyImpulse({ x: 0, y: 0, z: -0.2 }, true);
      } else if (isBackward) {
        rigidBody.current.applyImpulse({ x: 0, y: 0, z: 0.2 }, true);
      } else if (isLeft) {
        rigidBody.current.applyImpulse({ x: -0.2, y: 0, z: 0 }, true);
      } else if (isRight) {
        rigidBody.current.applyImpulse({ x: 0.2, y: 0, z: 0 }, true);
      } else if (isRightTop) {
        rigidBody.current.applyImpulse({ x: 0.2, y: 0, z: -0.2 }, true);
      } else if (isRightBottom) {
        rigidBody.current.applyImpulse({ x: 0.2, y: 0, z: 0.2 }, true);
      } else if (isLeftTop) {
        rigidBody.current.applyImpulse({ x: -0.2, y: 0, z: -0.2 }, true);
      } else if (isLeftBottom) {
        rigidBody.current.applyImpulse({ x: -0.2, y: 0, z: 0.2 }, true);
      }
    }
  });

  return (
    <RigidBody
      // enabledRotations={[false, true, false]}
      lockRotations={true}
      ref={rigidBody}
      colliders={"hull"}
      position={[0, 0, 14]}
    >
      <Capsule ref={meshRef} scale={0.5} position-y={1} args={[1, 2, 8, 8]} />
      <PerspectiveCamera
        ref={cameraRef}
        position={[0, 2, 0]}
        far={100}
        near={1}
        makeDefault={camera}
      />
    </RigidBody>
  );
};

export default Player;

// rigidBody.current?.setRotation(
//   quat().setFromEuler(
//     euler().setFromVector3(
//       new THREE.Vector3(0, Math.PI * turning, 0),
//       "XYZ"
//     )
//   ),
//   true
// );
