import { useEffect, useState } from "react";
import { getContract, loadWeb3 } from "../../abi";
import Field from "../../utils/field";
import Modal from "../../utils/modal";
import Scaffold from "../../utils/scaffold";
import Table from "../../utils/table";
import Tabs from "../../utils/tabs";
import Toggle from "../../utils/toggle";
import { upload } from "../../utils/upload";
import { dashboardTabs, links, testRecords, testTableHeaders } from "../config"
import { useWeb3 } from "@3rdweb/hooks";

export default function DoctorDashboard() {
    const today = new Date();
    const {address, connectWallet} = useWeb3();
    const [currentTab, setCurrentTab] = useState("Current Applications")
    const [isOpen, setIsOpen] = useState(false);

    const [currentSessions, setCurrentSessions] = useState([]);
    const [previousSessions, setPreviousSessions] = useState([]);

    const [AadhaarNumber, setAadhaarNumber] = useState("");
    const [symptoms, setSymptoms] = useState([]);
    const [diagnosis, setDiagnosis] = useState([]);
    const [prescription, setPrescription] = useState("");
    const [scansReport, setScansReport] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    // to filter the records
    useEffect(() => {
        async function main() {
            console.log("main started")
            await connectWallet("injected");
            console.log("wallet connected", )
            
            await loadWeb3();
            const contract = await getContract();
            const result = await contract.methods.getMedicalSessions().send({from: address});
            console.log("result", result)
        }
        main()
        let current = [];
        let previous = [];
        testRecords.forEach((record) => {
            if (record.isCompleted) {
                previous.push(record);
            } else {
                current.push(record);
            }
        })
        setCurrentSessions(current);
        setPreviousSessions(previous);

    }, [])

    const handleTabClick = (value) => {
        console.log(value)
        if (value != currentTab) setCurrentTab(value)
    }

    const handleEdit = (value) => {
        console.log(value)
        // TODO: change some state variable to set the current record
        // setIsOpen(!isOpen);
    }

    const scanUploadHandler = (e) => {
        console.log(e.target.files)
        upload(e.target.files)
        setScansReport(e.target.files);
    }

    const handleAddRecord = async () => {
        console.log("started")
        await loadWeb3()
        const cont = await getContract()
        await cont.methods.addMedicalRecord(
            AadhaarNumber,
            new Date().toString(),
            diagnosis,
            symptoms,
            prescription,
            scansReport,
            isCompleted
        ).send({ from: address })
        console.log("done")
    }


    return (
        <Scaffold links={links} page="Dashboard">
            <div className="">
                <h1 className="mt-6 text-4xl">Welcome, Doctor</h1>
                <h3>Today is {today.toDateString()} </h3>
            </div>
            <div className="py-3">
                <Tabs onClick={handleTabClick} tabs={dashboardTabs} current={currentTab} />
            </div>
            <div>
                {currentTab == "Current Applications" ? (
                    <Table head={testTableHeaders} data={currentSessions} onClick={handleEdit} editable editOnClick={()=>setIsOpen(true)}/>
                ) : (
                    <Table head={testTableHeaders} data={previousSessions} onClick={handleEdit} />
                )}
            </div>
            <Modal isOpen={isOpen} onCancel={() => setIsOpen(prev => !prev)} onSubmit={() => {handleAddRecord(); setIsOpen(false)}} >
                <Field label="Aadhaar number of patient" type="text" onChange={(e) => setAadhaarNumber(e.target.value)} />
                <Field label="Symptoms" type="text" onChange={(e) => setSymptoms(e.target.value.split(','))} />
                <Field label="Likely Diagnosis" type="text" onChange={(e) => setDiagnosis(e.target.value)} />
                <Field label="Medicines" type="tel" onChange={(e) => setPrescription(e.target.value.split(','))} />
                <Field label="Scans Report" type="file" onChange={scanUploadHandler} multiple/>
                <Toggle onClick={()=>setIsCompleted(!isCompleted)} >Is the Medical Session Completed?</Toggle>
            </Modal>
        </Scaffold>
    )
}