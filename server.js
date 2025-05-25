const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();

const PORT = 124;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server ใช้งานได้นะ จ๊าบบบ!!!! Tanatorn",
  });
});

// -------------------------------------------------------------------
const prisma = new PrismaClient();

app.post("/api/run", async (request, response) => {
  try {
    //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
    const { runLocation, runDistance, runTime } = request.body;

    //เอาข้อมูลที่อยู่ในตัวแปรส่งให้กับ Prisma เพื่อเอาไปบันทึก (create) ลงตาราง
    const result = await prisma.run_tb.create({
      data: {
        runLocation: runLocation,
        runDistance: runDistance,
        runTime: runTime,
      },
    });

    //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
    return response
      .status(201)
      .json({ message: "create complete", result: result });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.get("/api/run", async (request, response) => {
  try {
    //ให้ Prisma ไปดึงข้อมูลทั้งหมดจากตาราง
    const result = await prisma.run_tb.findMany();

    //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
    return response
      .status(200)
      .json({ message: "get complete", result: result });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
app.put("/api/run/:runId", async (request, response) => {
  try {
    //เอาข้อมูลที่ส่งมาซี่งจะอยู่ใน request.body มาเก็บในตัวแปร
    const { runLocation, runDistance, runTime } = request.body;

    //เอาข้อมูลที่อยู่ในตัวแปรกับที่ส่งมาเป็น request params ส่งให้กับ Prisma เพื่อเอาไปบันทึกแก้ไข (update) ลงตาราง
    const result = await prisma.run_tb.update({
      data: {
        runLocation: runLocation,
        runDistance: runDistance,
        runTime: runTime,
      },
      where: {
        runId: parseInt(request.params.runId),
      },
    });

    //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
    return response
      .status(200)
      .json({ message: "update complete", result: result });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
app.delete("/api/run/:runId", async (request, response) => {
  try {
    //เอาข้อมูลที่ส่งกับ request params ส่งให้กับ Prisma เพื่อเอาไปเป็นเงื่อนไขในการลบ
    const result = await prisma.run_tb.delete({
      where: {
        runId: parseInt(request.params.runId),
      },
    });

    //ส่งผลลัพธ์การทำงานกลับไปยัง client/user/frontend
    return response
      .status(200)
      .json({ message: "delete complete", result: result });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});
// -------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
