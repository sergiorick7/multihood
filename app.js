const contractAddress = "0xF0a82C2FD5a392D002Bc5BB358327556d13AF820";

const abi = [
  {"inputs":[],"name":"createCollection","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"deployContract","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"deployNFT","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"deployToken","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"executeTask","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"mintNFT","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"sayGM","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"sayGN","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

let signer, contract;

// Lista de tarefas mapeada para as funções do contrato
const tasks = [
    { name: "Say GM", func: () => contract.sayGM({ value: ethers.parseEther("0.0001") }) },
    { name: "Say GN", func: () => contract.sayGN({ value: ethers.parseEther("0.0001") }) },
    { name: "Mint NFT", func: () => contract.mintNFT({ value: ethers.parseEther("0.0001") }) },
    { name: "Deploy NFT", func: () => contract.deployNFT({ value: ethers.parseEther("0.0001") }) },
    { name: "Deploy Token", func: () => contract.deployToken({ value: ethers.parseEther("0.0001") }) },
    { name: "Deploy Contract", func: () => contract.deployContract({ value: ethers.parseEther("0.0001") }) },
    { name: "Create Collection", func: () => contract.createCollection({ value: ethers.parseEther("0.0001") }) }
];

document.getElementById('connectBtn').addEventListener('click', async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        
        const btn = document.getElementById('connectBtn');
        btn.innerText = "Connected: " + signer.address.substring(0, 6) + "...";
        btn.className = "w-full py-4 mb-4 rounded-xl font-bold bg-green-600 text-white transition";
        btn.disabled = true;
    } catch (err) { 
        console.error(err);
        alert("Connection failed!"); 
    }
});

document.getElementById('runWorkflowBtn').addEventListener('click', async () => {
    if (!contract) return alert("Connect wallet first!");

    const btn = document.getElementById('runWorkflowBtn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    for (let task of tasks) {
        try {
            console.log("Executing: " + task.name);
            const tx = await task.func();
            await tx.wait(); // Aguarda a confirmação na blockchain
        } catch (err) { 
            console.error(err);
            alert("Error in " + task.name); 
            btn.innerText = "Error - Try again";
            btn.disabled = false;
            return; 
        }
    }
    btn.innerText = "Workflow Complete!";
    alert("All 7 tasks finished successfully!");
    btn.disabled = false;
});
