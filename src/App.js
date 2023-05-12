import { useEffect, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

function App() {
  const [activeClass, setActiveClass] = useState("");
  const [attribute, setAttribute] = useState({});
  const [classes, setClasses] = useState({});
  const [attrCtr, setAttrCtr] = useState(0);
  const [skills, setSkills] = useState({});
  const [skillCtr, setSkillCtr] = useState(0);

  useEffect(() => {
    let tmp_attr = {};
    let tmp_skl = {};

    ATTRIBUTE_LIST.forEach(
      (attribute) => (tmp_attr[attribute] = { point: 0, modifier: -5 })
    );
    SKILL_LIST.forEach((skill) => (tmp_skl[skill.name] = 0));

    setAttribute((prev) => ({ ...prev, ...tmp_attr }));
    setSkills((prev) => ({ ...prev, ...tmp_skl }));

  }, []);

  useEffect(() => {
    setClasses(
      Object.fromEntries(
        Object.entries(CLASS_LIST).filter((cl) =>
          Object.entries(cl[1]).every(
            (attr) => attribute[attr[0]]?.point >= attr[1]
          )
        )
      )
    );
  }, [attribute]);

  const updateAttr = (attr, val) => {
    if (attrCtr + val > 70) {
      alert("Your character has already reached its max attributes (70)");
    } else {
      let tmp = {
        [attr]:{
          point: attribute[attr]?.point + val,
          modifier: Math.floor((attribute[attr]?.point + val - 10) / 2)
        }
      }
      setAttribute((prev) => ({
        ...prev,
        ...tmp,
      }));
      setAttrCtr((ctr) => ctr + val);
    }
  };

  const updateSkill = (skill, val) => {
    if (
      skillCtr + val >
      Math.max(0, 10 + 4 * attribute["Intelligence"].modifier)
    ) {
      alert(
        "Maxed out total skills, increase intelligence attribute to add more"
      );
    } else {
      setSkills((prev) => ({
        ...prev,
        [skill]: prev[skill] + val,
      }));
      setSkillCtr((ctr) => ctr + val);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Coding Test</h1>
      </header>
      <section className="App-section">
        <div>
          <strong>ATTRIBUTES</strong>
          {Object.entries(attribute).map((attr, ix) => (
            <div key={`${attr[0]}-${ix}`}>
              <p>{`${attr[0]} : ${attr[1].point} -> (Modifier: ${attr[1].modifier})`}</p>
              <button onClick={() => updateAttr(attr[0], 1)}>+</button>
              <button onClick={() => updateAttr(attr[0], -1)}>-</button>
            </div>
          ))}
        </div>
        <div>
          <strong>CLASSES</strong>
          {Object.entries(CLASS_LIST).map((cl, ix) => (
            <div key={`${cl[0]}-${ix}`}>
              <p
                style={{ color: classes[cl[0]] ? "yellow" : "white" }}
                onClick={() => setActiveClass(cl[0])}
              >
                {cl[0]}
              </p>
            </div>
          ))}
        </div>
        {activeClass && (
          <div>
            <strong>Min Req Stats for {activeClass}</strong>
            {Object.entries(CLASS_LIST[activeClass]).map((v, ix) => (
              <div key={`${v[0]}-${ix}`}>
                <p>
                  {v[0]} : {v[1]}
                </p>
              </div>
            ))}
            <strong style={{ color: "red" }} onClick={() => setActiveClass("")}>
              CLOSE [X]
            </strong>
          </div>
        )}
        <div>
          <strong>SKILLS</strong>
          <p>{`Total skills to spend = ${Math.max(
            0,
            10 + 4 * attribute["Intelligence"]?.modifier
          )}`}</p>
          {SKILL_LIST.map((skill, ix) => (
            <div key={`${skill.name}-${ix}`}>
              <p>{`${skill.name} : ${skills[skill.name]} -> (Modifier: ${
                attribute[skill.attributeModifier]?.modifier
              }) -> Total: ${
                skills[skill.name] + attribute[skill.attributeModifier]?.modifier
              }`}</p>
              <button onClick={() => updateSkill(skill.name, 1)}>+</button>
              <button onClick={() => updateSkill(skill.name, -1)}>-</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
