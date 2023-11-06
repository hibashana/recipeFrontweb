"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, imageURL } from '../utils/constants';
import NavBar from '../NavBar';

const User = () => {
  const [usersData, setUsersData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${baseURL}/user/alluser`,
          { headers: { 
            'Authorization': `Bearer ${token}`,
            "Cache-Control": "no-store" } }
        );
        setUsersData(response.data.rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteuser = async (ruserid, name) => {
    try {
      const token = localStorage.getItem('token');
      const URL = `${baseURL}/user/${ruserid}`;
      const response = await axios.delete(URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success(`User ${name} has been deleted.`);
        fetchData(); // Refresh the data after the delete
      } else {
        toast.error(`Failed to delete user ${name}`);
        console.error(`Failed to delete user ${name}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
      console.error(`An error occurred: ${error.message}`);
    }
  };

  const handleIsActive = async (ruserid, isactive) => {
    try {
      const token = localStorage.getItem('token');
      const URL = `${baseURL}/user/changeIsActive/${ruserid}`;
      const response = await axios.put(
        URL,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(`Active status updated for User ${ruserid}`);
        fetchData(); // Refresh the data after the update
      } else {
        toast.error(`Failed to update Active status for User ${ruserid}`);
        console.error(`Failed to update Active status for User ${ruserid}`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
      console.error(`An error occurred: ${error.message}`);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${baseURL}/user/alluser`,
        { headers: { 
          'Authorization': `Bearer ${token}`,
          "Cache-Control": "no-store" } }
      );
      setUsersData(response.data.rows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center m-4">
      <Link
        href="/addUser"
        className="bg-sky-600 text-black p-2 rounded-lg absolute top-4 right-40 hover:text-white transition-colors"
      >
        Register user
      </Link>

      <div className="max-w-screen-md">
        <table className="w-full table-fixed border p-2">
          <thead>
            <tr className="border p-2">
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody className="text-cyan-900 text-center">
            {usersData.map((data) => (
              <tr className="border p-2" key={data.ruserid}>
                <td className="border p-2">{data.name}</td>
                <td className="border p-2">{data.email}</td>
                <td className="border p-2">{data.contact}</td>
                <td className="border p-2">
                  {data.isactive ? 'Active' : 'Inactive'}
                </td>
                <td colSpan={2} className="flex items-center justify-center gap-4 p-6">
                  <div className="hover:text-red-700" onClick={() => deleteuser(data.ruserid, data.name)}>
                    <MdDeleteOutline />
                  </div>
                  <div className="hover:text-sky-500">
                    <Link className="transition-colors p-2" href={`/editUser/${data.ruserid}`}>
                      <AiOutlineEdit />
                    </Link>
                  </div>
                  <button
                    onClick={() => handleIsActive(data.ruserid, data.isactive)}
                    className="bg-green-500 text-black p-2 rounded-lg hover:text-white transition-colors"
                  >
                    Active
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NavBar />
    </div>
  );
};

export default User;
