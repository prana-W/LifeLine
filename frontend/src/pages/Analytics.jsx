import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Hospital, Pill, Activity, Heart, Siren, TrendingUp, Clock } from 'lucide-react';
import useApi from '@/hooks/useApi.js'

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];

const Analytics = () => {

    const api = useApi();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {

            const {success, message, data} = await api.get('/analytics/all');
            setData(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(fetchAnalytics, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold">Error loading analytics</p>
                    <p className="mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Prepare blood group data for charts
    const bloodGroupData = Object.entries(data.bloodBank.byBloodGroup).map(([type, values]) => ({
        name: type,
        donated: values.donated,
        received: values.received,
    })).filter(item => item.donated > 0 || item.received > 0);

    // Prepare organ donation data
    const organData = Object.entries(data.organDonation.byOrganType)
        .map(([type, values]) => ({
            name: type,
            registered: values.registered,
            donated: values.donated,
        }))
        .filter(item => item.registered > 0 || item.donated > 0);

    // Emergency status data
    const emergencyStatusData = Object.entries(data.emergencyServices.byStatus)
        .map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
        }))
        .filter(item => item.value > 0);

    // Hospital specialization data
    const specializationData = Object.entries(data.hospitals.bySpecialization)
        .map(([spec, count]) => ({
            name: spec,
            value: count,
        }))
        .filter(item => item.value > 0);

    const StatCard = ({ title, value, icon: Icon, subtitle, color = "blue" }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-${color}-600`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Healthcare Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-2">Real-time insights and metrics • Auto-refreshes every 10 seconds</p>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Users"
                        value={data.overview['Total Users']}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="Total Hospitals"
                        value={data.overview['Total Hospitals']}
                        icon={Hospital}
                        color="green"
                    />
                    <StatCard
                        title="Total Pharmacies"
                        value={data.overview['Total Pharmacies']}
                        icon={Pill}
                        color="purple"
                    />
                    <StatCard
                        title="Pincodes Tracked"
                        value={data.overview['Total Pincodes Tracked']}
                        icon={TrendingUp}
                        color="orange"
                    />
                </div>

                {/* Blood Bank Section */}
                {bloodGroupData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-600" />
                                Blood Bank Analytics
                            </CardTitle>
                            <CardDescription>Blood donations and requests by blood group</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {data.bloodBank['Total Blood Donations'] > 0 && (
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Total Donations</p>
                                        <p className="text-3xl font-bold text-red-600">
                                            {data.bloodBank['Total Blood Donations']}
                                        </p>
                                    </div>
                                )}
                                {data.bloodBank['Total Blood Requests'] > 0 && (
                                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Total Requests</p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {data.bloodBank['Total Blood Requests']}
                                        </p>
                                    </div>
                                )}
                                {data.bloodBank['Total Requests Fulfilled'] > 0 && (
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Requests Fulfilled</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {data.bloodBank['Total Requests Fulfilled']}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bloodGroupData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="donated" fill="#ef4444" name="Donated" />
                                    <Bar dataKey="received" fill="#f97316" name="Received" />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                <Card>
                                    <CardHeader><CardTitle>Donations</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={bloodGroupData} dataKey="donated" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                                    {bloodGroupData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Requests</CardTitle></CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <PieChart>
                                                <Pie data={bloodGroupData} dataKey="received" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                                    {bloodGroupData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>

                        </CardContent>
                    </Card>
                )}

                {/* Organ Donation Section */}
                {organData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-600" />
                                Organ Donation Analytics
                            </CardTitle>
                            <CardDescription>Organ registrations and donations by type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                {data.organDonation['Total Organ Registrations'] > 0 && (
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Registrations</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {data.organDonation['Total Organ Registrations']}
                                        </p>
                                    </div>
                                )}
                                {data.organDonation['Total Organs Donated'] > 0 && (
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Organs Donated</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {data.organDonation['Total Organs Donated']}
                                        </p>
                                    </div>
                                )}
                                {data.organDonation.byConsentType['Living Donations'] > 0 && (
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Living Donations</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {data.organDonation.byConsentType['Living Donations']}
                                        </p>
                                    </div>
                                )}
                                {data.organDonation.byConsentType['Posthumous Donations'] > 0 && (
                                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Posthumous</p>
                                        <p className="text-2xl font-bold text-indigo-600">
                                            {data.organDonation.byConsentType['Posthumous Donations']}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={organData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="registered" fill="#8b5cf6" name="Registered" />
                                    <Bar dataKey="donated" fill="#10b981" name="Donated" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Emergency Services */}
                {(data.emergencyServices['Total Emergencies'] > 0 || emergencyStatusData.length > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Siren className="h-5 w-5 text-red-600" />
                                    Emergency Services
                                </CardTitle>
                                <CardDescription>Emergency response metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.emergencyServices['Total Emergencies'] > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                            <span className="text-sm font-medium">Total Emergencies</span>
                                            <span className="text-xl font-bold text-red-600">
                        {data.emergencyServices['Total Emergencies']}
                      </span>
                                        </div>
                                    )}
                                    {data.emergencyServices['Total Ambulance Calls'] > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                            <span className="text-sm font-medium">Ambulance Calls</span>
                                            <span className="text-xl font-bold text-orange-600">
                        {data.emergencyServices['Total Ambulance Calls']}
                      </span>
                                        </div>
                                    )}
                                    {data.emergencyServices['Total Resolved'] > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <span className="text-sm font-medium">Resolved</span>
                                            <span className="text-xl font-bold text-green-600">
                        {data.emergencyServices['Total Resolved']}
                      </span>
                                        </div>
                                    )}
                                    {data.emergencyServices['Average Response Time (minutes)'] > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Avg Response Time
                      </span>
                                            <span className="text-xl font-bold text-blue-600">
                        {data.emergencyServices['Average Response Time (minutes)']} min
                      </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {emergencyStatusData.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Emergency Status Distribution</CardTitle>
                                    <CardDescription>Current status of emergency cases</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={emergencyStatusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {emergencyStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}


                {/* Medicines & Pharmacies */}
                {(data.medicines['Total Medicines'] > 0 || data.pharmacies['Total Pharmacies'] > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Pill className="h-5 w-5 text-purple-600" />
                                    Medicines
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data.medicines['Total Medicines'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">Total Medicines</span>
                                        <span className="text-xl font-bold text-purple-600">
                      {data.medicines['Total Medicines']}
                    </span>
                                    </div>
                                )}
                                {data.medicines['Total Quantity'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                                        <span className="text-sm font-medium">Total Quantity</span>
                                        <span className="text-xl font-bold text-indigo-600">
                      {data.medicines['Total Quantity']}
                    </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pharmacies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium">Total Pharmacies</span>
                                    <span className="text-xl font-bold text-blue-600">
                    {data.pharmacies['Total Pharmacies']}
                  </span>
                                </div>
                                {data.pharmacies['Total 24x7 Pharmacies'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">24x7 Pharmacies</span>
                                        <span className="text-xl font-bold text-green-600">
                      {data.pharmacies['Total 24x7 Pharmacies']}
                    </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* User Engagement */}
                {(data.users['Total Users'] > 0 || data.engagement['Total Appointments'] > 0) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    User Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-medium">Total Users</span>
                                    <span className="text-xl font-bold text-blue-600">
                    {data.users['Total Users']}
                  </span>
                                </div>
                                {data.users['New Users This Month'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">New Users This Month</span>
                                        <span className="text-xl font-bold text-green-600">
                      {data.users['New Users This Month']}
                    </span>
                                    </div>
                                )}
                                {data.users['Active Users'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium">Active Users</span>
                                        <span className="text-xl font-bold text-purple-600">
                      {data.users['Active Users']}
                    </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>User Engagement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data.engagement['Total Appointments'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium">Total Appointments</span>
                                        <span className="text-xl font-bold text-blue-600">
                      {data.engagement['Total Appointments']}
                    </span>
                                    </div>
                                )}
                                {data.engagement['Total Searches'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                        <span className="text-sm font-medium">Total Searches</span>
                                        <span className="text-xl font-bold text-orange-600">
                      {data.engagement['Total Searches']}
                    </span>
                                    </div>
                                )}
                                {data.engagement['Total Reviews'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                        <span className="text-sm font-medium">Total Reviews</span>
                                        <span className="text-xl font-bold text-yellow-600">
                      {data.engagement['Total Reviews']}
                    </span>
                                    </div>
                                )}
                                {data.engagement['Average Rating'] > 0 && (
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium">Average Rating</span>
                                        <span className="text-xl font-bold text-green-600">
                      {data.engagement['Average Rating']} ⭐
                    </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;