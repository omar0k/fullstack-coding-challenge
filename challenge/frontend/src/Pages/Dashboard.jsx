import React, { useEffect, useState } from "react";
import api from "../api";
import CasesCard from "../Components/CasesCard";
import Table from "../Components/Table";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Dashboard = ({ userName }) => {
  const [openCases, setOpenCases] = useState([]);
  const [closedCases, setClosedCases] = useState([]);
  const [topComplaintTypes, setTopCompltaintTypes] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [constituentsComplaints, setConstituentsComplaints] = useState([]);
  const [showConstituentsData, setShowConstituentsData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username;
  const logOut = () => {
    localStorage.removeItem("authToken");
    navigate("/login/");
  };
  const fetchConstituentsComplaints = async () => {
    setLoading(true);
    try {
      const response = await api.request(
        "/api/complaints/constituentsComplaints/"
      );
      setConstituentsComplaints(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetchng constituents complaints: " + error.message);
      setLoading(false);

      console.error(error.message);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        allComplaintsResponse,
        openCasesResponse,
        closedCasesResponse,
        topComplaintsResponse,
      ] = await Promise.all([
        api.request("/api/complaints/allComplaints/"),
        api.request("/api/complaints/openCases/"),
        api.request("/api/complaints/closedCases/"),
        api.request("/api/complaints/topComplaints/"),
      ]);
      setAllComplaints(allComplaintsResponse.data);
      setOpenCases(openCasesResponse.data);
      setClosedCases(closedCasesResponse.data);
      setTopCompltaintTypes(topComplaintsResponse.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-100">
      <div className="flex gap-10  p-5 rounded-lg flex-col my-10">
        <div className="flex justify-center text-lg font-semibold">
          Welcome, {username[0].toUpperCase()}.{" "}
          {username.slice(1).toUpperCase()}
        </div>
        <div className="flex gap-10 justify-center">
          <button
            onClick={() => {
              fetchConstituentsComplaints();
              setShowConstituentsData(!showConstituentsData);
            }}
            className="p-3 border-blue-500 border-2 rounded-md font-semibold transition-colors duration-200 hover:bg-blue-500"
          >
            {showConstituentsData
              ? "All Complaints"
              : "Complaints by My Constituents"}
          </button>

          <CasesCard title={"Open Cases"} content={openCases.length || 0} />
          <CasesCard title={"Closed Cases"} content={closedCases.length || 0} />
          <CasesCard
            title={"Top Type of Complaint"}
            content={
              topComplaintTypes.length > 0
                ? topComplaintTypes[0].complaint_type
                : "N/A"
            }
          />
          <button
            onClick={logOut}
            className=" hover:bg-red-500 gap-2 flex items-center transition-colors duration-200 border-2  border-red-500 rounded-md px-5"
          >
            <span>Log Out</span>
            <LogOut size={20} />
          </button>
        </div>

        <Table
          loading={loading}
          title={
            showConstituentsData
              ? "Complaints by My Consituents"
              : "All Complaints"
          }
          complaints={
            showConstituentsData ? constituentsComplaints : allComplaints
          }
        />
      </div>
      <div></div>
    </div>
  );
};

export default Dashboard;
