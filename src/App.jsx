
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { route } from './Routers/Route/Route';

import { Analytics } from "@vercel/analytics/react"

function App() {

      return (
            <div>

                  <Analytics />

                  <RouterProvider router={route}></RouterProvider>

            </div>

      );
}

export default App;
