async function handleRewrite() {
  const bullet = document.getElementById("bullet-input").value;
  const prof = document.querySelector(".sel-btn.active")?.dataset.val || "";
  const tone = document.querySelector("#tone-row .sel-btn.active")?.dataset.val || "";
  const jd = document.getElementById("jd-input").value;

  if (!bullet) {
    alert("Please enter a bullet!");
    return;
  }

  try {
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bullet, prof, tone, jd }),
    });

    const data = await res.json();
    console.log(data); // ici tu peux remplir tes champs Short / Standard / Executive
  } catch (err) {
    console.error(err);
    alert("Une erreur est survenue côté serveur.");
  }
}





