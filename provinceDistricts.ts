// Province to District Mapping for Pakistan

export interface District {
    id: string;
    name: string;
}

export interface Province {
    id: string;
    name: string;
    districts: District[];
}

export const PROVINCE_DISTRICTS: Province[] = [
    {
        id: 'federal-capital',
        name: 'Federal Capital Territory',
        districts: [
            { id: 'islamabad', name: 'Islamabad' }
        ]
    },
    {
        id: 'punjab',
        name: 'Punjab',
        districts: [
            { id: 'lahore', name: 'Lahore' },
            { id: 'faisalabad', name: 'Faisalabad' },
            { id: 'rawalpindi', name: 'Rawalpindi' },
            { id: 'multan', name: 'Multan' },
            { id: 'gujranwala', name: 'Gujranwala' },
            { id: 'sialkot', name: 'Sialkot' },
            { id: 'sargodha', name: 'Sargodha' },
            { id: 'bahawalpur', name: 'Bahawalpur' },
            { id: 'sahiwal', name: 'Sahiwal' },
            { id: 'gujrat', name: 'Gujrat' },
            { id: 'kasur', name: 'Kasur' },
            { id: 'sheikhupura', name: 'Sheikhupura' },
            { id: 'jhelum', name: 'Jhelum' },
            { id: 'attock', name: 'Attock' },
            { id: 'chakwal', name: 'Chakwal' },
            { id: 'jhang', name: 'Jhang' },
            { id: 'okara', name: 'Okara' },
            { id: 'pakpattan', name: 'Pakpattan' },
            { id: 'lodhran', name: 'Lodhran' },
            { id: 'vehari', name: 'Vehari' },
            { id: 'khanewal', name: 'Khanewal' },
            { id: 'dera-ghazi-khan', name: 'Dera Ghazi Khan' },
            { id: 'rajanpur', name: 'Rajanpur' },
            { id: 'muzaffargarh', name: 'Muzaffargarh' },
            { id: 'layyah', name: 'Layyah' },
            { id: 'bhakkar', name: 'Bhakkar' },
            { id: 'mianwali', name: 'Mianwali' },
            { id: 'khushab', name: 'Khushab' },
            { id: 'sargodha', name: 'Sargodha' },
            { id: 'narowal', name: 'Narowal' },
            { id: 'gujranwala', name: 'Gujranwala' },
            { id: 'sialkot', name: 'Sialkot' },
            { id: 'mandi-bahauddin', name: 'Mandi Bahauddin' },
            { id: 'hafizabad', name: 'Hafizabad' },
            { id: 'chiniot', name: 'Chiniot' },
            { id: 'toba-tek-singh', name: 'Toba Tek Singh' },
            { id: 'faisalabad', name: 'Faisalabad' }
        ]
    },
    {
        id: 'sindh',
        name: 'Sindh',
        districts: [
            { id: 'karachi-central', name: 'Karachi Central' },
            { id: 'karachi-east', name: 'Karachi East' },
            { id: 'karachi-south', name: 'Karachi South' },
            { id: 'karachi-west', name: 'Karachi West' },
            { id: 'karachi-malir', name: 'Karachi Malir' },
            { id: 'karachi-korangi', name: 'Karachi Korangi' },
            { id: 'hyderabad', name: 'Hyderabad' },
            { id: 'sukkur', name: 'Sukkur' },
            { id: 'larkana', name: 'Larkana' },
            { id: 'nawabshah', name: 'Nawabshah' },
            { id: 'mirpur-khas', name: 'Mirpur Khas' },
            { id: 'thatta', name: 'Thatta' },
            { id: 'badin', name: 'Badin' },
            { id: 'sanghar', name: 'Sanghar' },
            { id: 'khairpur', name: 'Khairpur' },
            { id: 'ghotki', name: 'Ghotki' },
            { id: 'shikarpur', name: 'Shikarpur' },
            { id: 'jacobabad', name: 'Jacobabad' },
            { id: 'kashmore', name: 'Kashmore' },
            { id: 'dadu', name: 'Dadu' },
            { id: 'jamshoro', name: 'Jamshoro' },
            { id: 'tando-allahyar', name: 'Tando Allahyar' },
            { id: 'tando-muhammad-khan', name: 'Tando Muhammad Khan' },
            { id: 'matiari', name: 'Matiari' },
            { id: 'umerkot', name: 'Umerkot' },
            { id: 'tharparkar', name: 'Tharparkar' }
        ]
    },
    {
        id: 'kpk',
        name: 'Khyber Pakhtunkhwa',
        districts: [
            { id: 'peshawar', name: 'Peshawar' },
            { id: 'mardan', name: 'Mardan' },
            { id: 'swat', name: 'Swat' },
            { id: 'abbottabad', name: 'Abbottabad' },
            { id: 'mansehra', name: 'Mansehra' },
            { id: 'kohat', name: 'Kohat' },
            { id: 'bannu', name: 'Bannu' },
            { id: 'd-i-khan', name: 'D.I. Khan' },
            { id: 'charsadda', name: 'Charsadda' },
            { id: 'nowshera', name: 'Nowshera' },
            { id: 'swabi', name: 'Swabi' },
            { id: 'haripur', name: 'Haripur' },
            { id: 'batkhela', name: 'Batkhela' },
            { id: 'dir-lower', name: 'Dir Lower' },
            { id: 'dir-upper', name: 'Dir Upper' },
            { id: 'chitral', name: 'Chitral' },
            { id: 'buner', name: 'Buner' },
            { id: 'shangla', name: 'Shangla' },
            { id: 'kohistan', name: 'Kohistan' },
            { id: 'tank', name: 'Tank' },
            { id: 'lakki-marwat', name: 'Lakki Marwat' },
            { id: 'karak', name: 'Karak' },
            { id: 'hangu', name: 'Hangu' },
            { id: 'torghar', name: 'Torghar' },
            { id: 'khyber', name: 'Khyber' },
            { id: 'bajaur', name: 'Bajaur' },
            { id: 'mohmand', name: 'Mohmand' },
            { id: 'kurram', name: 'Kurram' },
            { id: 'north-waziristan', name: 'North Waziristan' },
            { id: 'south-waziristan', name: 'South Waziristan' },
            { id: 'orakzai', name: 'Orakzai' }
        ]
    },
    {
        id: 'balochistan',
        name: 'Balochistan',
        districts: [
            { id: 'quetta', name: 'Quetta' },
            { id: 'turbat', name: 'Turbat' },
            { id: 'khuzdar', name: 'Khuzdar' },
            { id: 'chaman', name: 'Chaman' },
            { id: 'zhob', name: 'Zhob' },
            { id: 'gwadar', name: 'Gwadar' },
            { id: 'dera-bugti', name: 'Dera Bugti' },
            { id: 'sibi', name: 'Sibi' },
            { id: 'loralai', name: 'Loralai' },
            { id: 'mastung', name: 'Mastung' },
            { id: 'killa-saifullah', name: 'Killa Saifullah' },
            { id: 'pishin', name: 'Pishin' },
            { id: 'kalat', name: 'Kalat' },
            { id: 'nushki', name: 'Nushki' },
            { id: 'chagai', name: 'Chagai' },
            { id: 'washuk', name: 'Washuk' },
            { id: 'kharan', name: 'Kharan' },
            { id: 'awaran', name: 'Awaran' },
            { id: 'lasbela', name: 'Lasbela' },
            { id: 'jhal-magsi', name: 'Jhal Magsi' },
            { id: 'kachi', name: 'Kachi' },
            { id: 'jaffarabad', name: 'Jaffarabad' },
            { id: 'nasirabad', name: 'Nasirabad' },
            { id: 'lehri', name: 'Lehri' },
            { id: 'sohbatpur', name: 'Sohbatpur' },
            { id: 'musakhel', name: 'Musakhel' },
            { id: 'barkhan', name: 'Barkhan' },
            { id: 'kohlu', name: 'Kohlu' },
            { id: 'harnai', name: 'Harnai' },
            { id: 'ziarat', name: 'Ziarat' },
            { id: 'sherani', name: 'Sherani' }
        ]
    },
    {
        id: 'gb',
        name: 'Gilgit-Baltistan',
        districts: [
            { id: 'gilgit', name: 'Gilgit' },
            { id: 'skardu', name: 'Skardu' },
            { id: 'hunza', name: 'Hunza' },
            { id: 'nagar', name: 'Nagar' },
            { id: 'ghizer', name: 'Ghizer' },
            { id: 'astore', name: 'Astore' },
            { id: 'diamer', name: 'Diamer' },
            { id: 'ghanche', name: 'Ghanche' },
            { id: 'shigar', name: 'Shigar' },
            { id: 'kharmang', name: 'Kharmang' }
        ]
    }
];

export const getDistrictsByProvince = (provinceName: string): District[] => {
    const province = PROVINCE_DISTRICTS.find(p => 
        p.name === provinceName || 
        p.id === provinceName.toLowerCase().replace(/\s+/g, '-')
    );
    return province ? province.districts : [];
};

export const getProvinceOptions = () => {
    return [
        { value: '', label: '- None -' },
        ...PROVINCE_DISTRICTS.map(p => ({ value: p.name, label: p.name }))
    ];
};


