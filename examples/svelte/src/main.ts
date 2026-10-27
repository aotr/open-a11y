import { mount } from "svelte";
import "../../shared/demo.css";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app")! });
