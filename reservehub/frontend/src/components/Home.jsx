import HeaderText from "../components/HeaderText";

const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >

      <HeaderText title="Home" />
      <div className={'infofield'} style={{color: "black"}}>
        <p>Falls du dich für unseren Service interessierst, dann kontaktiere uns gerne unter:</p>
        <p>k.erbay@me.com</p>
      </div>

    </div>
  );
};

export default Home;
