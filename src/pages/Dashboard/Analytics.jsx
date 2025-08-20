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
      
    </div>
  );
};

export default Analytics;
