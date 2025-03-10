import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Calendar from './Calendar';
import image4 from '../assets/adminpic.png';
import image5 from '../assets/adminpic.png';
import logo from '../assets/logo.png';
import Footer from '../components/footer';
import notification from '../assets/icons/Notification.png';
import useAuth from "../components/useAuth";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query, limit } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsIqHHA8727cGeTjr0dUQQmttqJ2nW_IE",
  authDomain: "muniserve-4dc11.firebaseapp.com",
  projectId: "muniserve-4dc11",
  storageBucket: "muniserve-4dc11.appspot.com",
  messagingSenderId: "874813480248",
  appId: "1:874813480248:web:edd1ff1f128b5bb4a2b5cd",
  measurementId: "G-LS66HXR3GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const Dashboard = ({ count }) => {

  // State to hold the fetched data
  const [data, setData] = useState([]);
  const [localData, setLocalData] = useState([]);

  // Function for the account name
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = () => {
      if (user) {
        const email = user.email;
        const truncatedEmail = email.length > 5 ? `${email.substring(0, 5)}...` : email;
        setUserEmail(truncatedEmail);
      }
    };

    fetchUserEmail();
  }, [user]);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const appointmentsQuery = query(collection(firestore, "appointments"), orderBy("date", "desc"), limit(2)); // Limit to the latest 5 appointments
      const querySnapshot = await getDocs(appointmentsQuery);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(items);
      setLocalData(items); // Initialize localData with the fetched data
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  // State for currentDateTime
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update currentDateTime every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="logo" className="SidebarLogo" />
        <div className="SidebarTitle">
          <span className="muni">MUNI</span>
          <span className="serve">SERVE</span>
        </div>

        <nav className="horizontal-nav">
          <ul>
            <li>
              <a href="dashboard">Home</a>
            </li>
            <li className="dropdown">
              <a>Services</a>
              <div className="dropdown-content">
                <a href="/birthReg">Certificate of Live Birth</a>
                <a href="/marriageCert">Marriage Certificate</a>
                <a href="/deathCert">Death Certificate</a>
                <a href="/businessPermit">Business Permit</a>
                <a href="/job">Job Application</a>
              </div>
            </li>
            <li><a href="/appointments">Appointments</a></li>
            <li><a href="/transactions">News</a></li>
            <li><a href="/transactions">About</a></li>
            <li><a href="/transactions">Settings</a></li>
          </ul>
        </nav>

        <div className="icons">
          <img
            src={notification}
            alt="Notification.png"
            className="notif-icon"
          />

          <div className="account-name">
            <h1>{userEmail}</h1>
          </div>
        </div>
      </div>

      <div className="clock">
        <h4>Good day, It's</h4>
        <h2>{formattedTime}</h2>
      </div>

    <div className='center'>
      <div className="news">
        News
      </div>

      <div className="image-admin">
        <img src={image4} alt="adminpic.png" />
        <img src={image5} alt="adminpic.png" />
      </div>

      <div className='subhead'  style={{ marginLeft: '-120px' }}>
        Appointments
      </div>
      <div className="subhead">
        <div className="requests"  style={{ marginLeft: '-190px' }}>
          {data.map((item) => (
            <div key={item.id} className="request-item">
              <div className="title">
                <img src={logo} alt="logo" />
                <h5>Appointment</h5>
                <h3>{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</h3>
              </div>
              <p>
                {item.name} requested for {item.personnel} from {item.department} for an appointment on {new Date(item.date.seconds * 1000).toLocaleDateString()} at {new Date(item.time.seconds * 1000).toLocaleTimeString()} regarding {item.reason}.
                Check the application for approval.
              </p>
              <a href='./appointments'><button className='check'>Check Now</button></a>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: '60px' }}>
          <Calendar />
        </div>
      </div>
      </div>

      <Footer/>
    </div>
  );
}

export default Dashboard;
