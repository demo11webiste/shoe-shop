import { IoClose } from "react-icons/io5";
import s from "./productdetail.module.scss";
import { useSnapshot } from "valtio";
import { store } from "@/store";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useRouter } from "next/router";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";

const UPDATE_ORDER = gql`
  mutation publishOrder($id: ID, $paymentId: String, $status: String) {
    updateOrder(
      data: { stripePaymentId: $paymentId, statues: $status }
      where: { id: $id }
    ) {
      id
    }
  }
`;

const CREATE_ORDER = gql`
  mutation createOrder($order: OrderCreateInput!) {
    createOrder(data: $order) {
      id
      name
      email
      productName
      price
      stripePaymentId
      statues
    }
  }
`;

const PUBLISH_ORDER = gql`
  mutation publishOrder($id: ID) {
    publishOrder(to: PUBLISHED, where: { id: $id }) {
      id
    }
  }
`;

const ProductDetail = () => {
  const {
    shoeDetailPopupIsActive,
    shoeDetail,
    shoeRotateRight,
    shoeRotateLeft,
  } = useSnapshot(store);

  const [user] = useAuthState(auth);

  const { push, query } = useRouter();

  const [createOrderOnCMS] = useMutation(CREATE_ORDER);

  const [updateOrderOnCMS] = useMutation(UPDATE_ORDER);

  const [publishOrderOnCMS] = useMutation(PUBLISH_ORDER);

  const updateOrderAndPublish = async () => {
    const { data } = await updateOrderOnCMS({
      variables: {
        id: query.order_id,
        paymentId: query.session_id,
        status: "ordered",
      },
    });

    publishOrderOnCMS({
      variables: {
        id: data.updateOrder.id,
      },
    });
  };

  useEffect(() => {
    if (query.success) {
      updateOrderAndPublish();
    }
  }, [query]);

  const handleClick = async () => {
    try {
      const { data: orderData } = await createOrderOnCMS({
        variables: {
          order: {
            name: user?.displayName,
            email: user?.email,
            productName: shoeDetail.heading,
            price: String(shoeDetail.price),
            statues: "canceled",
          },
        },
      });

      const { data } = await axios.post(
        "/api/checkout_sessions",
        {
          price: shoeDetail.stripePrice,
          orderId: orderData.createOrder.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      push(data.session.url);
    } catch (error) {
      console.log(error);
      alert("Checkout Failed");
    }
  };

  const handleClose = () => {
    store.shoeDetailPopupIsActive = false;
    store.shoeCameraDefault = false;
    store.ladyshoeCameraDefault = false;
  };

  const handleShowSignIn = () => {
    store.isShowSignIn = true;
  };

  return (
    <>
      <div data-active={shoeDetailPopupIsActive} className={s.rotate}>
        <button onClick={shoeRotateLeft}>
          <AiOutlineLeft />
        </button>
        <button onClick={shoeRotateRight}>
          <AiOutlineRight />
        </button>
      </div>
      <div data-active={shoeDetailPopupIsActive} className={s.main}>
        <div onClick={handleClose} className={s.main_icon}>
          <IoClose />
        </div>
        <div className={s.main_heading}>
          <h2>{shoeDetail.heading}</h2>
          <h3>{shoeDetail.subheading}</h3>
        </div>
        <ul>
          {shoeDetail.detail.map((e, i) => {
            return <li key={i}>{e}</li>;
          })}
        </ul>
        <div className={s.main_box}>
          <button onClick={user === null ? handleShowSignIn : handleClick}>
            Buy Now
          </button>

          <h2>&euro;{shoeDetail.price}</h2>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
