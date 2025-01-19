'use client'
import CreatePassForm from '@/components/HeroUI/Form/CreatePassForm';
import HeroUIDateRangePicker from '@/components/HeroUI/DateFromTo/DateFromTo';
import FailAlert from '@/components/HeroUI/Alert/FailAlerts';


export default function ReportPage() {
  return (

    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 mt-10 text-gray-800 text-center">Create A Pass</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-12 mt-2">
          <div >
            <CreatePassForm />
           
        </div>
      </div>
    </div>
          )
}