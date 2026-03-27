#include "Missions/MissionObjectiveVolume.h"
#include "Missions/MissionManager.h"
#include "Characters/HampiRunnerCharacter.h"

AMissionObjectiveVolume::AMissionObjectiveVolume()
{
	OnActorBeginOverlap.AddDynamic(this, &AMissionObjectiveVolume::OnOverlapBegin);
}

void AMissionObjectiveVolume::BeginPlay()
{
	Super::BeginPlay();
}

void AMissionObjectiveVolume::OnOverlapBegin(AActor* OverlappedActor, AActor* OtherActor)
{
	if (!OtherActor->IsA<AHampiRunnerCharacter>()) return;

	if (AMissionManager* Manager = MissionManagerRef.Get())
	{
		// Very simple: whenever player enters, advance mission.
		// You can add checks here against ObjectiveStageId if you want stricter logic.
		Manager->CompleteCurrentStage();
	}
}
