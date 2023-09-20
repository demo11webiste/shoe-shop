import { store } from "@/store";
import s from "./controls.module.scss";
import { BsFillCaretUpFill } from "react-icons/bs";

const MobileControls = () => {
  return (
    <div className={s.main}>
      <button
        onPointerDown={() => (store.mobileTurnLeft = true)}
        onPointerUp={() => (store.mobileTurnLeft = false)}
        data-turnleft
      >
        <BsFillCaretUpFill />
      </button>
      <button
        onPointerDown={() => (store.mobileForward = true)}
        onPointerUp={() => (store.mobileForward = false)}
      >
        <BsFillCaretUpFill />
      </button>
      <button
        data-turnright
        onPointerDown={() => (store.mobileTurnRight = true)}
        onPointerUp={() => (store.mobileTurnRight = false)}
      >
        <BsFillCaretUpFill />
      </button>
      <button
        data-left
        onPointerDown={() => (store.mobileLeft = true)}
        onPointerUp={() => (store.mobileLeft = false)}
      >
        <BsFillCaretUpFill />
      </button>
      <button
        data-bottom
        onPointerDown={() => (store.mobileBackward = true)}
        onPointerUp={() => (store.mobileBackward = false)}
      >
        <BsFillCaretUpFill />
      </button>
      <button
        data-right
        onPointerDown={() => (store.mobileRight = true)}
        onPointerUp={() => (store.mobileRight = false)}
      >
        <BsFillCaretUpFill />
      </button>
    </div>
  );
};

export default MobileControls;
