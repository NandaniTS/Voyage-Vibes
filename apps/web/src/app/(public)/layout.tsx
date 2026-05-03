
import App from "../(public)/app";

export default async function PublicLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const { children } = props;

  return <App>{children}</App>;
}
