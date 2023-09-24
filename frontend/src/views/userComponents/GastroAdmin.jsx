import HeaderText from "../HeaderText";

const Gastroadmin = () => {
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

            <HeaderText title="Logged In" />
            <div className={'infofield'} style={{color: "black"}}>
                <p>Gastro</p>
                <p>k.erbay@me.com</p>
            </div>

        </div>
        );
};

export default Gastroadmin;
