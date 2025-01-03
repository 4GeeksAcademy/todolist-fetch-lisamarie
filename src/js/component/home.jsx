import React from "react";
import { Todolist } from "./Todolist";


//create your first component
const Home = () => {
	return (
		<div className="Home text-center ">
			<h1 className="text-center mt-5 text-danger text-danger-emphasis">To-Do List</h1>
		<Todolist/>
		</div>
	);
};

export default Home;
