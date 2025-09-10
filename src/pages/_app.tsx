import type { AppProps } from "next/app";
import Layout from "../wrapper/layout";
import "@/styles/globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReactQueryProvider>
  );
}
