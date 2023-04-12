import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Vehicle() {

    const [vehicles, setVehicles] = useState([])
    const [selectedType, setSelectedType] = useState('')
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);


    useEffect(() => {
        axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json&page=2')
            .then((response) => {
                console.log(response.data.Results);
                setVehicles(response.data.Results)
            }).catch((err) => {
                console.log(err);
            })
    }, [])

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value)
    }

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
    };


    return (
        <div>
            <h1 className='header'>VEHICLE MANUFACTURERS</h1>
            <div className="filter">
                <div>
                    <label htmlFor="search-query">Search:</label>
                    <input id="search-query" type="text" value={searchQuery} onChange={handleSearchQueryChange} />
                </div>
                <label htmlFor="type-select">Filter by vehicle type:</label>
                <select id="type-select" value={selectedType} onChange={handleTypeChange}>
                    <option value="">All</option>
                    <option value="Passenger Car">Passenger Car</option>
                    <option value="Multipurpose Passenger Vehicle (MPV)">MPV</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Low Speed Vehicle (LSV)">(LSV)</option>
                </select>
            </div>
            <div className="table">
                <table>
                    <thead className='table-head'>
                        <th>Name</th>
                        <th>Country</th>
                        <th>Type</th>
                    </thead>
                    <tbody className='table-body'>
                        {Array.isArray(vehicles) &&
                            vehicles.filter((vehicle) => {
                                if (selectedType === '' && searchQuery === '') {
                                    return true
                                } else {
                                    return (
                                        (selectedType === '' || vehicle.VehicleTypes.some((type) => type.Name === selectedType && type.IsPrimary === true)) &&
                                        (searchQuery === '' || (vehicle.Mfr_CommonName && vehicle.Mfr_CommonName.toLowerCase().includes(searchQuery.toLowerCase())))
                                    )
                                }
                            }).map((vehicle) => (
                                <tr key={vehicle.Mfr_ID} onClick={() => handleVehicleSelect(vehicle)}>
                                    <td>{vehicle.Mfr_CommonName}</td>
                                    <td>{vehicle.Country}</td>
                                    <td>{vehicle.VehicleTypes.length > 0 ? vehicle.VehicleTypes[0].Name : 'N/A'}</td>
                                </tr>

                            ))
                        }
                    </tbody>


                </table>
            </div>
            {selectedVehicle && (
                <div className="popup">
                    <div className="popup-content">
                        <button className="popup-close" onClick={() => setSelectedVehicle(null)}>X</button>
                        <p>{selectedVehicle.Mfr_CommonName}</p>
                        <p>{selectedVehicle.Country}</p>
                    </div>
                </div>
            )}

        </div>
    )
}
