import { useEffect, useState } from "react"
import { getContract, loadWeb3 } from "../../abi"
import Card from "../../utils/card"
import Scaffold from "../../utils/scaffold"
import { links } from "../config"

function Field(props){
    return (
        <div>
            <p className="font-medium">{props.name}</p>
            <p className="text-gray-500 mb-2">{props.value}</p>
        </div>
    )
}

export default function PatientRecords(){

    const [patientDetails, setPatientDetails] = useState({})

    useEffect(()=>{
        // get the adhaar value from cookie
        let adhaar = document.cookie.split("=")[1];

        async function main(){
            await loadWeb3()
            const cont = await getContract()
            const patient = await cont.methods.getPatientDetails(adhaar).call()
            console.log(patient)
            // const patientDetails = {
            //     Aadhar: "123456789012",
            //     Name: "John Doe",
            //     DOB: "12/02/2021",
            //     Phone: "1234567890",
            //   }
            setPatientDetails({
                Aadhar: patient[0],
                Name: patient[1],
                DOB: patient[2],
                Phone: patient[3]
            })
        }
        main()
    }, [])
    // console.log(patientDetails.keys())
    return (
        <Scaffold links={links}>

            <Card title="Personal Info">
                <div className="flex p-10">
                    <img className="h-60 w-60 rounded-full" alt="image" src="https://fakeface.rest/face/view?gender=male"/>
                    <div className="flex flex-col justify-center min-h-full w-full px-20">
                        {  
                            // loop through the object
                            Object.keys(patientDetails).map((key)=>{
                                return <Field name={key} value={patientDetails[key]}/>
                            })
                        }
                    </div>
                </div>
            </Card>
        </Scaffold>
    )
}

/*string adhaarNumber;
        string name;
        string dob;
        string phone;
        string patientAddress;*/