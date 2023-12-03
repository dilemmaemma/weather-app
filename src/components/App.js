import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import moment from 'moment';
import countryList from '../data/countries';

const App = () => {
    //const now = moment().format('MMMM Do YYYY, h:mm:ss a');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [countryId, setCountryId] = useState('');
    const [units, setUnits] = useState('standard');
    const [lang, setLang] = useState('en');

    const setCntry = async (e) => {
        const selectedCountryCode = e.target.value;
        const selectedCountry = countryList[selectedCountryCode];
    
        if (selectedCountry) {
            setCountry(selectedCountry);
            setCountryId(selectedCountryCode);
        } else {
            // Handle the case when selectedCountry is undefined
            setCountry('');
            setCountryId('');
        }
    };

    useEffect(() => {
        console.log(country, countryId);
    }, [country, countryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(city, state, countryId, units, lang);

        axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${countryId}&limit=5&appid=${process.env.REACT_APP_API_APPID}`)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const handleReset = () => {
        setCity('');
        setState('');
        setCountry('');
        setCountryId('');
        setUnits('standard');
        setLang('en');
    };

    return (
        <div>
            {process.env.REACT_APP_API_APPID}
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div>
                    <label htmlFor='country'>Country: </label>
                    <select
                        id='country'
                        onChange={setCntry}
                        required={true}
                        value={countryId}
                    >
                        <option value={''}>Select a Country</option>
                        {Object.entries(countryList).map(([code, country]) => (
                            <option key={code} value={code}>{country}</option>
                        ))}
                    </select>

                </div>
                {
                    <div>
                        <label htmlFor='state'>State Abbreviation: </label>
                        <input 
                            type="text" 
                            id='state' 
                            required={true}
                            onChange={(e) => setState(e.target.value)} 
                        />
                    </div>
                }
                {
                    <div>
                        <label htmlFor='city'>City: </label>
                        <input
                            type="text"
                            id='city'
                            required={true}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                }
                <div>
                    <button type='submit'>Submit</button>
                    <button type='reset'>Reset</button>
                </div>
            </form>
        </div>
    );
};

export default App;
