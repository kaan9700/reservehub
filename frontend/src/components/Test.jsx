import NavBar from "./NavBar.jsx";
import SideBar from "./SideBar.jsx";


const Test = () => {
    return (
        <>
            <div className={'user-wrapper'}>
                <SideBar/>
                <div className={'content'} style={{color: 'black'}}>
                   <div className={'container'}>
                       <div className={'child'}>
                           <p>Lorem </p>
                       </div>
                       <div className={'child'}>
                           <p>Lorem ipsum</p>
                       </div>
                       <div className={'child'}>
                           <p>Lorem ipsum dol</p>
                       </div>
                   </div>
                </div>
            </div>
        </>

    );
}

export default Test;
