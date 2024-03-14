import HeaderStats from "./headerStats/layout";
import SettingsButton from "./settingsButton/layout";


export default function HeaderLayout() {

    return (
        <div className="flex flex-row items-center justify-between gap-60">
            <HeaderStats />
            <div className="flex flex-row">
                <SettingsButton/>
                <button className="ml-6 border rounded ">Login</button>
                <button className="ml-6 border rounded ">Sign up</button>
            </div>
        </div>

    );
}