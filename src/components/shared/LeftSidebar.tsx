import { INITIAL_USER, useUserContext } from '@/context/AuthContext'
import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Loader from './Loader';
import { INavLink } from '@/types';
import { sidebarLinks } from '@/constants';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user, setUser, setIsAuthenticated, isLoading} = useUserContext();
    const { mutate: signOut } = useSignOutAccount();
    function handleSignOut(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        e.preventDefault();
        signOut();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        navigate("/sign-in")
    }

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                {/* Logo  */}
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.svg" alt="logo" width={170} height={36} />
                </Link>
                
                {/* Profile Data  */}
                {isLoading || !user.email 
                    ? <div className="h-14"><Loader /></div>
                    : (
                        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                            <img
                                src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                alt="profile"
                                className="h-14 w-14 rounded-full"
                            />
                            <div className="flex flex-col gap-6">
                                <p className="body-bold">{user.name}</p>
                                <p className="small-regular text-light-3">@{user.username}</p>
                            </div>
                        </Link>
                    )
                }

                {/* List of Links  */}
                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((linkItem: INavLink)=> {
                        const isActive = pathname === linkItem.route
                        return (
                            <li key={linkItem.label} className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}>
                                <NavLink to={linkItem.route} className="flex gap-4 items-center p-4">
                                    <img src={linkItem.imgURL} alt={linkItem.label} className={`group-hover:invert-white ${isActive && "invert-white"}`} />
                                    {linkItem.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>

                <Button variant="ghost" className="shad-button_ghost" onClick={(e) => handleSignOut(e)}>
                    <img src="/assets/icons/logout.svg" alt="logout"  />
                    <p className="small-medium lg:base-medium">Logout</p>
                </Button>
            </div>
        </nav>
    )
}

export default LeftSidebar