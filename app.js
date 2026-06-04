const contractAddress = "0xF0a82C2FD5a392D002Bc5BB358327556d13AF820";
const abi = [
  {"inputs":[],"name":"mintNFT","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"sayGM","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"sayGN","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

let signer, contract;

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
    } catch (err) { alert("Connection failed!"); }
});

document.getElementById('runWorkflowBtn').addEventListener('click', async () => {
    if (!contract) return alert("Connect wallet first!");

    const tasks = [
        { name: "Say GM", func: () => contract.sayGM({ value: ethers.parseEther("0.0001") }) },
        { name: "Say GN", func: () => contract.sayGN({ value: ethers.parseEther("0.0001") }) },
        { name: "Mint NFT", func: () => contract.mintNFT({ value: ethers.parseEther("0.0001") }) }
    ];

    const btn = document.getElementById('runWorkflowBtn');
    btn.innerText = "Processing...";
    btn.disabled = true;

    for (let task of tasks) {
        try {
            const tx = await task.func();
            await tx.wait();
        } catch (err) { 
            alert("Error in " + task.name); 
            break; 
        }
    }
    btn.innerText = "Workflow Complete!";
    alert("All tasks done!");
});