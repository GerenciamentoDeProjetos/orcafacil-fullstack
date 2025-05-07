import React from 'react';
import Header from './Header';
import { Wallet } from 'lucide-react';
import { HiChartBar } from 'react-icons/hi';


const Dashboard = () => {


    return (
        <>
            <Header />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-white p-4 rounded-xl shadow-md flex flex-col justufy-between">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg front-semibold text-gray-800">Current Balance</h2>
                        <Wallet className='text-blue-400' />
                    </div>
                    <div className="mt-4 text-3xl front-bold text-gray-900">$2,324.76</div>
                    <div className="mt-2 text-sm text-green-600 bg-green-100 w-fit px-2 py-1 rounded-md">Income compared to the previous mounth</div>

                    <div className="mt-4 flex justify-between text-sm text-gray-600">
                        <div>
                            <p>Income</p>
                            <p className='text-green-600 font-medium'>$5,654.71</p>
                        </div>
                        <div>
                            <p>Expenses</p>
                            <p className="text-red-500 font-medium">$563.65</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Monthly Expenses <span className="">2025</span></h2>
                        <HiChartBar className="text-blue-400 w-6 h-6" />
                    </div>

                    <div className="mt-10 flex justify-center items-center text-gray-400">
                        <p>No data available</p>
                    </div>

                    <div className="mt-8 flex justify-between text-sm text-gray-400">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                            <span key={month}>{month}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
                        <HiChartBar className="text-blue-400 w-6 h-6" />
                    </div>
                    {/* Categoria e barra */}
                    {[
                        { label: "Housing", amount: "$1,200.00", percent: 33, color: "bg-blue-100", text: "text-blue-500", count: 3 },
                        { label: "Food", amount: "$850.00", percent: 23, color: "bg-green-100", text: "text-green-500", count: 25 },
                        { label: "Transportation", amount: "$450.00", percent: 12, color: "bg-yellow-100", text: "text-yellow-500", count: 12 },
                        { label: "Entertainment", amount: "$320.00", percent: 9, color: "bg-pink-100", text: "text-pink-400", count: 8 },
                        { label: "Shopping", amount: "$580.00", percent: 16, color: "bg-pink-200", text: "text-pink-600", count: 15 },
                        { label: "Others", amount: "$280.00", percent: 8, color: "bg-gray-200", text: "text-gray-500", count: 7 },
                    ].map((item, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="flex justify-between text-sm font-medium text-gray-800">
                                <span>{item.label}</span>
                                <span>{item.amount}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full mt-1 mb-1">
                                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span className={`${item.text} font-semibold`}>{item.percent}%</span>
                                <span>{item.count} transactions</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            📅
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-full border border-gray-200 rounded-md px-3 py-2 mb-4 text-sm text-gray-600 placeholder-gray-400"
                    />
                    <div className="space-y-4 overflow-y-auto max-h-64 pr-1">
                        {[
                            { title: "Apartment Rent", category: "Housing", date: "Oct 14, 2023", amount: "-$1,200.00", color: "text-red-500", icon: "⬇️" },
                            { title: "Salary Deposit", category: "Income", date: "Oct 11, 2023", amount: "+$3,500.00", color: "text-green-600", icon: "⬆️" },
                            { title: "Grocery Shopping", category: "Food", date: "Oct 9, 2023", amount: "-$125.45", color: "text-red-500", icon: "⬇️" },
                            { title: "Uber Ride", category: "Transportation", date: "Oct 7, 2023", amount: "-$32.50", color: "text-red-500", icon: "⬇️" },
                        ].map((tx, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-xl">{tx.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{tx.title}</p>
                                        <p className="text-xs text-gray-500">{tx.category} • {tx.date}</p>
                                    </div>
                                </div>
                                <div className={`text-sm font-bold ${tx.color}`}>{tx.amount}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
};

export default Dashboard;
