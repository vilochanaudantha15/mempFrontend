import CurrentStock from "../../components/currentStock/CurrentStock";
import Production from "../../components/production/Production";
import CurrentDateShift from "../../components/shift&date/Shift";
import WeeklyIncome from "../../components/weeklyIncome/WeeklyIncome";
import "../../scss/analytics.scss"; // Import the SCSS file


const Analytics = () => {
  return (
    <div className="analytics">
      <div className="box box1">
      <CurrentStock/>
      </div>
      <div className="box box2">
   
      </div>
      <div className="box box3">
    
      </div>
      
      <div className="box box5">
      
      </div>
      <div className="box box6">
        
      </div>
      
    </div>
  );
};

export default Analytics;
