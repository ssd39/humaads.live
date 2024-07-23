import React from 'react';
import ReactDOM from 'react-dom/client';
import 'video.js/dist/video-js.css';

import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './pages/Home';
import './index.css';
import Demo from './pages/Demo';
import VideoPlayer from './pages/Demo/VideoPlayer';
import Overview from './pages/Dashboard/Overview';
import Campaign from './pages/Dashboard/Campaign';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 

const router = createBrowserRouter([
  {
    path: "/hello",
    element: <div>HumaAds.live</div>,
  },
  {
    path: "/dashboard/overview",
    element: <Overview />,
  },
  {
    path: "/dashboard/campaign",
    element: <Campaign />,
  },
  {
    path: "/demo/play",
    element: <VideoPlayer />,
  },
  {
    path: "/demo",
    element: <Demo />,
  },
  {
    path: "/",
    element: <Home />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
            <ToastContainer />
       <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
