using UnityEngine;
using System.Collections.Generic;
using System.IO;

[System.Serializable]
public class Mission
{
    public int id;
    public string title;
    public string description;
    public string type;
    public float timeLimit;
    public int reward;
    public List<string> objectives;
}

[System.Serializable]
public class MissionList
{
    public List<Mission> missions;
}

public class MissionManager : MonoBehaviour
{
    public static MissionManager Instance;

    public TextAsset missionConfigFile;
    public List<Mission> activeMissions;
    public Mission currentMission;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);

        DontDestroyOnLoad(gameObject);
        LoadMissions();
    }

    public void LoadMissions()
    {
        if (missionConfigFile != null)
        {
            MissionList data = JsonUtility.FromJson<MissionList>(missionConfigFile.text);
            activeMissions = data.missions;
            Debug.Log($"Loaded {activeMissions.Count} missions.");
        }
        else
        {
            Debug.LogWarning("Mission config file not assigned!");
        }
    }

    public void StartMission(int missionId)
    {
        currentMission = activeMissions.Find(m => m.id == missionId);
        if (currentMission != null)
        {
            Debug.Log($"Starting Mission: {currentMission.title}");
            // Initialize mission parameters (timer, objectives, etc.)
        }
    }

    public void CompleteMission()
    {
        if (currentMission != null)
        {
            Debug.Log($"Mission Completed: {currentMission.title}");
            // Grant rewards, unlock next mission
            currentMission = null;
        }
    }
}
