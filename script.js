function handleFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  const chunkSize = document.getElementById('chunkSizeInput').valueAsNumber;

  const reader = new FileReader();
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const users = XLSX.utils.sheet_to_json(worksheet);

    const chunks = [];
    for (let i = 0; i < users.length; i += chunkSize) {
      chunks.push(users.slice(i, i + chunkSize));
    }

    const fileListDiv = document.getElementById('fileList');
    fileListDiv.innerHTML = ''; // Clear previous file list

    chunks.forEach((chunk, index) => {
      const newWorkbook = XLSX.utils.book_new();
      const newWorksheet = XLSX.utils.json_to_sheet(chunk);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, `file_${index + 1}`);
      let newFilePath = `file_${index + 1}.csv`;

      let csv = XLSX.utils.sheet_to_csv(newWorksheet);
      let blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      let downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = newFilePath;
      downloadLink.innerHTML = `Yuklab olish: ${newFilePath}`;
      fileListDiv.appendChild(downloadLink);
      fileListDiv.appendChild(document.createElement('br'));
    });

    const fileCount = document.createElement('p');
    fileCount.innerHTML = `Yuklab olingan fayllar soni: ${chunks.length}`;
    fileListDiv.appendChild(fileCount);
  };

  reader.readAsArrayBuffer(file);
}
