import Header from "./header/Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <div>
            <Header />
            {children}
        </div>
    )
}
export default Layout