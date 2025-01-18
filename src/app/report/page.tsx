'use client'
import CreatePassForm from '@/components/HeroUI/Form/CreatePassForm';
import HeroUIDateRangePicker from '@/components/HeroUI/DateFromTo/DateFromTo';
import FailAlert from '@/components/HeroUI/Alert/FailAlerts';


export default function ReportPage() {
  return (

    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 mt-20 text-gray-800">Create A Pass</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 mt-2">



        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"> */}
          <div >
            <CreatePassForm />
            {/* <FailAlert /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
          )
}