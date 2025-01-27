import Homepage from "@/pages/component/home";
import Head from "next/head";
import Layout from "../layout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Library</title>
      </Head>
      <Homepage />
    </>
  );
}
