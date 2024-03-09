import { getDocs, query, collection, getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

document.getElementById('viewImagesButton').addEventListener('click', function() {
    // Get a reference to the Firestore collection
    const db = getFirestore();
    const q = query(collection(db, "damages"));

    // Fetch all documents from the collection
    getDocs(q).then((querySnapshot) => {
        // Clear the images container
        let imagesContainer = document.getElementById('imagesContainer');
        imagesContainer.innerHTML = '';

        // Loop through each document and create an img element for each image
        querySnapshot.forEach((doc) => {
            let imageUrl = doc.data().imageUrl;
            let img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            imagesContainer.appendChild(img);
        });

        // Hide the main video
        document.getElementById('video').style.display = 'none';

        document.getElementById('imagesContainer').style.display = 'grid';


    }).catch((error) => {
        console.error('Error getting documents: ', error);
    });
});