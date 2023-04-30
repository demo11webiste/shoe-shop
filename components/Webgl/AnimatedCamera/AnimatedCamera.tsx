import { store } from "@/store";
import { PerspectiveCamera, useHelper } from "@react-three/drei";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Pane } from "tweakpane";
import { useSnapshot } from "valtio";

const AnimatedCamera = () => {
  const { animatedCameraConfig, shoeRotatingMesh, shoeCameraDefault } =
    useSnapshot(store);

  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const [rotateAngel, setRotate] = useState<number>(-0.7);
  // useHelper(cameraRef, THREE.CameraHelper);

  const [isDefault, setIsDefault] = useState<boolean>(false);

  // useEffect(() => {
  //   const pane = new Pane();

  //   pane.addInput(cameraRef.current!.position, "x", {
  //     min: -20,
  //     max: 20,
  //     step: 0.01,
  //   });
  //   pane.addInput(cameraRef.current!.position, "y", {
  //     min: -20,
  //     max: 20,
  //     step: 0.01,
  //   });
  //   pane.addInput(cameraRef.current!.position, "z", {
  //     min: -20,
  //     max: 20,
  //     step: 0.01,
  //   });
  //   pane.addInput(cameraRef.current!.rotation, "y", {
  //     min: 0,
  //     max: Math.PI * 2,
  //     step: 0.01,
  //     label: "RotationY",
  //   });
  //   pane
  //     .addButton({ title: "Make Default" })
  //     .on("click", () => setIsDefault(!isDefault));
  // }, []);

  useEffect(() => {
    const { x, y, z } = animatedCameraConfig;

    gsap.timeline().to(cameraRef.current!.position, { x, y, z });

    if (shoeRotatingMesh !== null) {
      store.shoeRotateRight = () => {
        gsap
          .timeline()
          .to(shoeRotatingMesh.rotation, { y: Math.PI * rotateAngel });
        setRotate(rotateAngel - 0.1);
      };
      store.shoeRotateLeft = () => {
        gsap
          .timeline()
          .to(shoeRotatingMesh.rotation, { y: Math.PI * rotateAngel });
        setRotate(rotateAngel + 0.1);
      };
    }
  }, [animatedCameraConfig, rotateAngel]);

  useEffect(() => {
    if (shoeCameraDefault === false) {
      gsap.set(cameraRef.current!.position, { x: 18, y: 2.5, z: -14.4 });
    }
  }, [shoeCameraDefault]);

  return (
    <PerspectiveCamera
      ref={cameraRef}
      position={[18, 2.5, -14.4]}
      far={100}
      near={1}
      rotation-y={2.84}
      makeDefault={shoeCameraDefault}
    />
  );
};

export default AnimatedCamera;
